import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Search, Clock, Star, Leaf, AlertTriangle } from 'lucide-react';

interface HomeRemedy {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  conditions: string[];
  safety_notes?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  preparation_time?: string;
  effectiveness_rating?: number;
}

export const HomeRemedies = () => {
  const [remedies, setRemedies] = useState<HomeRemedy[]>([]);
  const [filteredRemedies, setFilteredRemedies] = useState<HomeRemedy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [loading, setLoading] = useState(true);

  const { supabase } = useAuth();

  useEffect(() => {
    fetchRemedies();
  }, []);

  useEffect(() => {
    filterRemedies();
  }, [searchTerm, selectedCondition, remedies]);

  const fetchRemedies = async () => {
    try {
      // For now, using mock data since home_remedies table doesn't exist
      const mockRemedies: HomeRemedy[] = [
        {
          id: '1',
          title: 'Honey and Ginger Tea',
          description: 'Natural remedy for sore throat and cough',
          ingredients: ['1 tbsp honey', '1 inch fresh ginger', '1 cup hot water'],
          instructions: ['Grate ginger', 'Add to hot water', 'Steep for 5 minutes', 'Add honey and drink warm'],
          conditions: ['sore throat', 'cough', 'cold'],
          difficulty_level: 'easy',
          preparation_time: '10 minutes',
          effectiveness_rating: 4.5
        },
        {
          id: '2', 
          title: 'Turmeric Milk',
          description: 'Anti-inflammatory drink for joint pain and immunity',
          ingredients: ['1 cup warm milk', '1/2 tsp turmeric powder', '1 tsp honey'],
          instructions: ['Heat milk gently', 'Mix turmeric in warm milk', 'Add honey', 'Drink before bedtime'],
          conditions: ['joint pain', 'inflammation', 'immunity'],
          difficulty_level: 'easy',
          preparation_time: '5 minutes',
          effectiveness_rating: 4.3
        }
      ];
      setRemedies(mockRemedies);
    } catch (error) {
      console.error('Error fetching remedies:', error);
      // Fallback to mock data if database is not set up
      setRemedies(mockRemedies);
    } finally {
      setLoading(false);
    }
  };

  const filterRemedies = () => {
    let filtered = remedies;

    if (searchTerm) {
      filtered = filtered.filter(remedy =>
        remedy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.conditions.some(condition => 
          condition.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        remedy.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCondition !== 'all') {
      filtered = filtered.filter(remedy =>
        remedy.conditions.includes(selectedCondition)
      );
    }

    setFilteredRemedies(filtered);
  };

  const getAllConditions = () => {
    const conditions = new Set<string>();
    // Add null check to prevent forEach error when remedies is undefined
    if (remedies && remedies.length > 0) {
      remedies.forEach(remedy => {
        remedy.conditions?.forEach(condition => conditions.add(condition));
      });
    }
    return Array.from(conditions).sort();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Natural Home Remedies
        </h2>
        <p className="text-xl text-muted-foreground">
          Time-tested natural solutions for common health concerns
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search remedies, conditions, or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Conditions</option>
            {getAllConditions().map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Important Safety Notice
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                These home remedies are for informational purposes only. Always consult with a healthcare 
                professional before trying new treatments, especially if you have existing medical conditions 
                or are taking medications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRemedies.map((remedy) => (
          <Card key={remedy.id} className="hover:shadow-wellness transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{remedy.title}</CardTitle>
                <Badge className={getDifficultyColor(remedy.difficulty_level)}>
                  {remedy.difficulty_level}
                </Badge>
              </div>
              <p className="text-muted-foreground">{remedy.description}</p>
              {remedy.effectiveness_rating && renderStars(remedy.effectiveness_rating)}
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-sm mb-2 flex items-center">
                  <Leaf className="w-4 h-4 mr-1 text-green-600" />
                  Ingredients:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {remedy.ingredients.map((ingredient, idx) => (
                    <li key={idx}>• {ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Instructions:</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  {remedy.instructions.map((instruction, idx) => (
                    <li key={idx}>{idx + 1}. {instruction}</li>
                  ))}
                </ol>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Good for:</p>
                <div className="flex flex-wrap gap-1">
                  {remedy.conditions.map((condition, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              {remedy.preparation_time && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  Prep time: {remedy.preparation_time}
                </div>
              )}

              {remedy.safety_notes && (
                <div className="bg-accent/10 rounded p-3 border-l-4 border-accent">
                  <p className="text-xs text-foreground">
                    <strong>Safety:</strong> {remedy.safety_notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRemedies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            No remedies found matching your search criteria.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedCondition('all');
            }}
            variant="outline"
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

// Mock data for fallback
const mockRemedies: HomeRemedy[] = [
  {
    id: '1',
    title: 'Honey & Ginger Tea',
    description: 'Soothing remedy for cold and cough symptoms',
    ingredients: ['1 tbsp fresh ginger', '2 tbsp honey', '1 cup hot water', 'Half lemon'],
    instructions: [
      'Grate fresh ginger and steep in hot water for 5 minutes',
      'Strain the ginger water',
      'Add honey and lemon juice',
      'Drink warm 2-3 times daily'
    ],
    conditions: ['Cold', 'Cough', 'Sore Throat'],
    difficulty_level: 'easy',
    preparation_time: '10 minutes',
    effectiveness_rating: 4.5,
    safety_notes: 'Not suitable for children under 1 year due to honey'
  },
  {
    id: '2',
    title: 'Turmeric Milk',
    description: 'Anti-inflammatory drink for joint pain and immunity',
    ingredients: ['1 cup warm milk', '1 tsp turmeric powder', '1/2 tsp cinnamon', 'Honey to taste'],
    instructions: [
      'Heat milk in a saucepan',
      'Add turmeric and cinnamon',
      'Simmer for 2-3 minutes',
      'Add honey before drinking'
    ],
    conditions: ['Joint Pain', 'Inflammation', 'Immunity Boost'],
    difficulty_level: 'easy',
    preparation_time: '5 minutes',
    effectiveness_rating: 4.2
  },
  {
    id: '3',
    title: 'Aloe Vera Gel',
    description: 'Natural remedy for minor burns and skin irritation',
    ingredients: ['Fresh aloe vera leaf'],
    instructions: [
      'Cut open fresh aloe vera leaf',
      'Extract the clear gel',
      'Apply directly to affected area',
      'Leave for 15-20 minutes before rinsing'
    ],
    conditions: ['Burns', 'Skin Irritation', 'Cuts'],
    difficulty_level: 'easy',
    preparation_time: '2 minutes',
    effectiveness_rating: 4.7,
    safety_notes: 'Test on small skin area first to check for allergic reactions'
  }
];